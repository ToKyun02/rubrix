import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentDto } from './dtos/create-assignment.dto';
import { UpdateAssignmentDto } from './dtos/update-assignment.dto';

@Injectable()
export class AssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.assignment.findMany({ include: { rubricItems: true } });
  }

  findOne(id: string) {
    return this.prisma.assignment.findUnique({
      where: { id },
      include: { rubricItems: true },
    });
  }

  create(dto: CreateAssignmentDto) {
    const totalScore = dto.rubricItems.reduce(
      (acc, cur) => acc + cur.points,
      0,
    );

    if (totalScore !== 100)
      throw new BadRequestException('루브릭 배점 합계는 100이어야 합니다.');

    return this.prisma.assignment.create({
      data: {
        ...dto,
        rubricItems: {
          create: dto.rubricItems,
        },
      },
      include: {
        rubricItems: true,
      },
    });
  }

  update(id: string, dto: UpdateAssignmentDto) {
    const { rubricItems, ...rest } = dto;
    if (rubricItems) {
      const total = rubricItems.reduce((acc, cur) => cur.points + acc, 0);
      if (total !== 100)
        throw new BadRequestException('루브릭 배점 합계는 100이어야 합니다.');
    }

    return this.prisma.assignment.update({
      where: { id },
      data: {
        ...rest,
        ...(rubricItems && {
          rubricItems: {
            deleteMany: {},
            create: rubricItems,
          },
        }),
      },
      include: {
        rubricItems: true,
      },
    });
  }

  async publish(id: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
    });

    if (assignment?.publishedAt) return assignment;

    return this.prisma.assignment.update({
      where: { id },
      data: { publishedAt: new Date() },
    });
  }

  unpublish(id: string) {
    return this.prisma.assignment.update({
      where: { id },
      data: { publishedAt: null },
    });
  }

  remove(id: string) {
    return this.prisma.assignment.delete({
      where: {
        id,
      },
    });
  }
}
