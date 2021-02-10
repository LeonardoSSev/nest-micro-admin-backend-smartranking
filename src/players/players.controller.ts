import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UpdatePlayerPayloadDTO } from './dtos/update-player-payload.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {

  logger = new Logger(PlayersController.name);

  constructor(private readonly playersService: PlayersService) {}

  @MessagePattern('list-players')
  async listCategories(): Promise<Player[]> {
    return await this.playersService.listPlayers();
  }

  @MessagePattern('find-player')
  async findCategoryById(@Payload() _id: string) {
    return await this.playersService.findPlayerById(_id);
  }

  @EventPattern('create-player')
  async createCategory(@Payload() player: Player) {
    this.logger.log(`Player: ${JSON.stringify(player)}`);

    await this.playersService.createPlayer(player);
  }

  @EventPattern('update-player')
  async updatePlayer(@Payload() updatePlayerPayloadDTO: UpdatePlayerPayloadDTO) {
    await this.playersService.updatePlayer(updatePlayerPayloadDTO);
  }

  @EventPattern('delete-player')
  async deletePlayer(@Payload() id: string) {
    await this.playersService.deletePlayer(id);
  }
}

