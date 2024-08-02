import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { StatusEnum } from 'src/common/enums';
  
  @Injectable()
  export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
      // Add your custom authentication logic here
      // for example, call super.logIn(request) to establish a session.
      const { currentUser } = context.switchToHttp().getRequest();
  
      if (!currentUser || currentUser.Status != Number(StatusEnum.Active)) {
        throw new UnauthorizedException();
      }
      return super.canActivate(context);
    }
  
    handleRequest(err, user, info) {
      // if (err || !user || user.status != Number(StatusEnum.Active)) {
      //   throw err || info || new UnauthorizedException();
      // }
      if (err || info) {
        console.log("err", err, "info", info)
        throw new UnauthorizedException();
      }
      return user;
    }
  }