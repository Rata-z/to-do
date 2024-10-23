import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { Task } from '@prisma/client';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  let mockTask: Task = {
    id: 1,
    title: 'Test title',
    description: 'Test description',
    status: TaskStatus.TO_DO,
    created_at: new Date(),
  };
  let mockTask2: Task = {
    id: 2,
    title: 'Test title',
    description: 'Test description',
    status: TaskStatus.COMPLETED,
    created_at: new Date(),
  };
  let mockTasks: Task[] = [mockTask, mockTask2];

  const mockTaskService = {
    findOne: jest.fn((id: number) => {
      if (id === mockTask.id) return Promise.resolve(mockTask);
      if (id === mockTask2.id) return Promise.resolve(mockTask2);
      return Promise.reject(new NotFoundException('Task not found'));
    }),
    findAll: jest.fn((status?: TaskStatus) => {
      if (!status) return mockTasks;
      if (status === TaskStatus.TO_DO) return [mockTask];
      if (status === TaskStatus.COMPLETED) return [mockTask2];
      return [];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [{ provide: TaskService, useValue: mockTaskService }],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should have service defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTaskById', () => {
    it('should return task', async () => {
      const result = await controller.getTaskById(1);
      expect(result).toEqual(mockTask);
    });
    it('should throw NotFoundException', async () => {
      await expect(controller.getTaskById(3)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllTasks', () => {
    it('should return two tasks', async () => {
      const result = await controller.getAllTasks();
      expect(result).toEqual(mockTasks);
    });
    it('should return empty array', async () => {
      const result = await controller.getAllTasks(TaskStatus.IN_PROGRESS);
      expect(result).toEqual([]);
    });
    it('should return task', async () => {
      const result = await controller.getAllTasks(TaskStatus.COMPLETED);
      expect(result).toEqual([mockTask2]);
    });
  });
});
