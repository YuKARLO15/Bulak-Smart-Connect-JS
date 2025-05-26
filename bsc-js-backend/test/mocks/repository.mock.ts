export const AnnouncementRepositoryMock = {
  provide: 'AnnouncementRepository',
  useValue: {
    // Mock methods for AnnouncementRepository
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
};

export const AppointmentRepositoryMock = {
  provide: 'AppointmentRepository',
  useValue: {
    // Mock methods for AppointmentRepository
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
};