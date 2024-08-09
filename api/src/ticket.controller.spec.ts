import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from '../src/services/ticket.service';
import { EntityManager } from 'typeorm';
import IORedis from 'ioredis';
import Redlock from 'redlock';

// Mock the EntityManager class
class MockEntityManager {
  findOne = jest.fn();
  save = jest.fn();
}

describe('TicketService', () => {
  let service: TicketService;
  let mockEntityManager: MockEntityManager;
  let redisClient: IORedis;
  let redlock: Redlock;

  beforeAll(async () => {
    redisClient = new IORedis();

    // Initialize Redlock with the Redis client
    redlock = new Redlock([redisClient]);

    // Create an instance of the mock EntityManager
    mockEntityManager = new MockEntityManager();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: 'REDLOCK',
          useValue: redlock,
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should correctly handle concurrent ticket purchases', async () => {
    // Setup mock behavior
    const mockTicket = { id: 1, quantity: 10 };
    mockEntityManager.findOne.mockResolvedValue(mockTicket);
    mockEntityManager.save.mockResolvedValue({ ...mockTicket, quantity: 5 });

    const purchase1 = service.purchaseTicket(1, 10);
    const purchase2 = service.purchaseTicket(1, 5);
    const purchase3 = service.purchaseTicket(1, 2);
    const purchase4 = service.purchaseTicket(1, 1);
    const purchase5 = service.purchaseTicket(1, 3);

    const [result1, result2, result3, result4, result5] = await Promise.allSettled([purchase1, purchase2, purchase3, purchase4, purchase5]);

    console.log('Result 1:', result1);
    console.log('Result 2:', result2);
    console.log('Result 3:', result3);
    console.log('Result 4:', result4);
    console.log('Result 5:', result5);

    // Ensure the second purchase fails due to insufficient tickets
    expect(result1.status).toBe('fulfilled');
    expect(result2.status).toBe('rejected');
  });
});
