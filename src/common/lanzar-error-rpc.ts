import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export const lanzarErrorRPC = (status: HttpStatus, message: string) => {
  throw new RpcException({
    status: status,
    message: message,
  });
};
