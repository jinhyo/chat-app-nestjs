import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('Connected: ', client.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Disconnected: ', client.id);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): WsResponse<string> {
    // WsResponse<string>의 string은 data의 type

    return { event: 'msgToClient', data: 'hello world!!!' };
    // msgToServer로 보낸 clinet에게만 event를 보냄
    // 전체 메시지로 보내고 싶을 경우 wss 사용
    // this.wss.emit('msgToCLient','hello world!!!')
  }

  // @SubscribeMessage('messageToServer') // 위와 동일
  // handleMessage2(client: Socket, text: string): void {
  //   client.emit('msgToClient', text);
  // }

  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    return data;
  }
}
