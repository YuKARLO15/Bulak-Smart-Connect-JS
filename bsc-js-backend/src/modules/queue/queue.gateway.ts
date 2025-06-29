import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QueueService } from './queue.service';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: process.env.WS_CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  namespace: 'socket.io', // Add this to match client expectation
})
export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(QueueGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => QueueService))
    private readonly queueService: QueueService,
    private readonly configService: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.logger.log(`CORS origin configured: ${this.configService.get('WS_CORS_ORIGIN')}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinQueue')
  async handleJoinQueue(client: Socket, queueId: number) {
    await client.join(`queue_${queueId}`);
    const queueData = await this.queueService.getQueueDetails(queueId);
    return queueData;
  }

  @SubscribeMessage('getQueuePosition')
  async handleGetQueuePosition(client: Socket, queueId: number) {
    const position = await this.queueService.getQueuePosition(queueId);
    return { position };
  }

  @SubscribeMessage('joinCounter')
  async handleJoinCounter(client: Socket, counterId: number) {
    await client.join(`counter_${counterId}`);
    return { success: true };
  }

  @SubscribeMessage('join_queue_updates')
  async handleJoinQueueUpdates(client: Socket) {
    this.logger.log(`Socket ${client.id} joined queue updates`);
    await client.join('queue_updates');
    return { event: 'joined', data: 'Successfully joined queue updates' };
  }

  // Send updates to all clients or specific rooms
  notifyQueueUpdate(queueId: number, data: any) {
    void this.server.to(`queue_${queueId}`).emit('queueUpdate', data);
    void this.server.emit('queueListUpdate'); // Global queue update
  }

  notifyCounterUpdate(counterId: number, data: any) {
    void this.server.to(`counter_${counterId}`).emit('counterUpdate', data);
    void this.server.emit('counterListUpdate'); // Global counter update
  }
}
