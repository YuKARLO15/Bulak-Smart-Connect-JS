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

@WebSocketGateway({
  cors: {
    origin: '*', // In production, set to your frontend URL
  },
})
export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(QueueGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => QueueService))
    private readonly queueService: QueueService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinQueue')
  async handleJoinQueue(client: Socket, queueId: number) {
    client.join(`queue_${queueId}`);
    const queueData = await this.queueService.getQueueDetails(queueId);
    return queueData;
  }

  @SubscribeMessage('getQueuePosition')
  async handleGetQueuePosition(client: Socket, queueId: number) {
    const position = await this.queueService.getQueuePosition(queueId);
    return { position };
  }

  @SubscribeMessage('joinCounter')
  handleJoinCounter(client: Socket, counterId: number) {
    client.join(`counter_${counterId}`);
    return { success: true };
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
