import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Task } from '@prisma/client';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    task: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const newTask: Prisma.TaskCreateInput = {
        title: 'Test task',
        description: 'Test description',
        status: TaskStatus.TO_DO,
      };
      const createdTask: Task = { id: 1, ...newTask, created_at: new Date() };
      mockPrismaService.task.create.mockResolvedValue(createdTask);

      expect(await service.create(newTask)).toEqual(createdTask);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: newTask,
      });
    });
  });
  describe('update', () => {
    it('should update task', async () => {
      const existingTask: Task = {
        id: 1,
        title: 'Test task',
        description: 'Test description',
        status: TaskStatus.TO_DO,
        created_at: new Date(),
      };
      const updated: Task = existingTask;
      updated.description = 'new description';
      mockPrismaService.task.findUnique.mockResolvedValue(existingTask);
      mockPrismaService.task.update.mockResolvedValue(updated);

      expect(
        await service.update(1, { description: 'new description' }),
      ).toEqual(updated);
      expect(prismaService.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.task.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { description: 'new description' },
      });
    });
    it('should throw NotFoundException', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);
      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });
});
