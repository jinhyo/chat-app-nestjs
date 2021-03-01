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

@WebSocketGateway({ namespace: '/chat' })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Initialized~');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Connected: ', client.id);
    console.log('rooms: ', client.adapter.rooms);

    this.logger.log('Connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Disconnected: ', client.id);
    this.logger.log('Disconnected', client.id);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(
    @MessageBody() text: any,
    @ConnectedSocket() client: Socket,
  ): WsResponse<string> {
    // WsResponse<string>의 string은 data의 type
    console.log('text: ', text);
    console.log('client.id: ', client.id);

    return { event: 'msgToClient', data: 'hello world!!!' };
    // msgToServer로 보낸 clinet에게만 event를 보냄
    // 전체 메시지로 보내고 싶을 경우 wss 사용
    // this.wss.emit('msgToCLient', 'hello world!!!');
  }

  // @SubscribeMessage('msgToServer') // 위와 동일
  // handleMessage2(client: Socket, text: string): void {
  //   client.emit('msgToClient', text);
  // }

  // @SubscribeMessage('events')
  // handleEvent(
  //   @MessageBody() data: any,
  //   @ConnectedSocket() client: Socket,
  // ): any {
  //   console.log('data: ', data);
  //   console.log('client.id: ', client.id);

  //   return data;
  // }

  @SubscribeMessage('sendMessage')
  takeMessage(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {
    console.log('msg', msg);
    console.log('client.id', client.id);
    // client.broadcast.emit('message', 'sent message');
    this.wss.emit('message', 'hello world!!!');
  }
}
