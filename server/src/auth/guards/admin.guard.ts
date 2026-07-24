import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const sub = req.user?.sub;
    if (!sub) throw new UnauthorizedException();

    const user = await this.prisma.user.findUnique({
      where: { id: sub },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') throw new ForbiddenException();
    return true;
  }
}
