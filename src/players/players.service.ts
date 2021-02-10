import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerPayloadDTO } from './dtos/update-player-payload.dto';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async listPlayers(): Promise<Player[]> {
    try {
      return await this.playerModel.find().exec();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async findPlayerById(_id: string): Promise<Player> {
    try {
      const player = await this.playerModel.findById(_id);

      this.validatePlayerExistence(player, _id);

      return player;
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async createPlayer(player: Player): Promise<Player> {
    try {
      const storedPlayer = new this.playerModel(player);

      return await storedPlayer.save();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async updatePlayer(updatePlayerPayloadDTO: UpdatePlayerPayloadDTO): Promise<Player> {
    try {
      const { id: _id, player } = updatePlayerPayloadDTO;

      let storedPlayer = await this.playerModel.findById(_id);
      
      this.validatePlayerExistence(player, _id);

      storedPlayer = this.updatePlayerInfo(storedPlayer, player);

      return await this.playerModel.findByIdAndUpdate(_id, { $set: storedPlayer }).exec();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async deletePlayer(_id: string): Promise<void> {
    try {
      let storedPlayer = await this.playerModel.findById(_id);
      
      this.validatePlayerExistence(storedPlayer, _id);

      await this.playerModel.findByIdAndDelete(_id).exec();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  validatePlayerExistence(player: Player | null, id: string) {
    if (!player) {
      throw new RpcException(`Player with given _id ${id} was not found!`);
    }
  }

  private updatePlayerInfo(playerForUpdating: Player, updatedPlayer: Player): Player {
    const { name, email, phoneNumber, urlPicture } = updatedPlayer;

    if (name) {
      playerForUpdating.name = name;
    }

    if (email) {
      playerForUpdating.email = email;
    }

    if (phoneNumber) {
      playerForUpdating.phoneNumber = phoneNumber;
    }

    if (urlPicture) {
      playerForUpdating.urlPicture = urlPicture;
    }

    return playerForUpdating;
  }
}
