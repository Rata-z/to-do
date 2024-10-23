import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { TaskModule } from '../src/task/task.module';
import { Prisma } from '@prisma/client';
import { TaskStatus } from '../src/task/task-status.enum';
import { PrismaModule } from '../src/prisma/prisma.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TaskModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    //prepare database for test (delete rows and restart auto-incrementing) (CASCADE (fk) is a bit overkill)
    await prismaService.$executeRaw`TRUNCATE "public"."Task" RESTART IDENTITY CASCADE;`;
  }, 30000);

  afterAll(async () => {
    await app.close();
    await prismaService.$disconnect();
  }, 30000);

  it('should create a task', async () => {
    const task: Prisma.TaskCreateInput = {
      title: 'Title',
      description: 'description',
      status: TaskStatus.TO_DO,
    };
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send(task)
      .expect(201);

    expect(response.body.id).toEqual(1);
  });
  it('should get a task by id', async () => {
    const response = await request(app.getHttpServer())
      .get('/tasks/1')
      .expect(200);
  });
  it('should get task by status', async () => {
    const response = await request(app.getHttpServer())
      .get(`/tasks?status=${TaskStatus.TO_DO}`)
      .expect(200);

    expect(response.body[0].status).toEqual('TO_DO');
  });
  it('should update task', async () => {
    const newData = {
      title: 'New Title',
      description: 'New description',
      status: TaskStatus.COMPLETED,
    };
    const response = await request(app.getHttpServer())
      .put('/tasks/1')
      .send(newData)
      .expect(200);

    expect(response.body.status).toEqual(TaskStatus.COMPLETED);
    expect(response.body.title).toEqual('New Title');
  });
  it('should delete task', async () => {
    await request(app.getHttpServer()).delete('/tasks/1').expect(204);
    await request(app.getHttpServer()).get('/tasks/1').expect(404);
  });
});
