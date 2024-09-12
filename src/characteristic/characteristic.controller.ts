import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CharacteristicService } from './characteristic.service';
import { CreateCharacteristicDto, UpdateCharacteristicDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enums';
import { Role } from 'src/common/decorator';

@ApiTags('Characteristic')
@Controller('characteristic')
export class CharacteristicController {
  constructor(private readonly characteristicService: CharacteristicService) {}

  @Role(RoleEnum.ADMIN)
  @Post()
  create(@Body() createCharacteristicDto: CreateCharacteristicDto) {
    return this.characteristicService.create(createCharacteristicDto);
  }

  @Get()
  findAll() {
    return this.characteristicService.findAll();
  }

  @Get(':characteristic')
  findOne(@Param('characteristic') characteristicName: string) {
    return this.characteristicService.findOne(characteristicName);
  }

  @Role(RoleEnum.ADMIN)
  @Patch(':characteristic')
  update(
    @Param('characteristic') characteristicName: string,
    @Body() updateCharacteristicDto: UpdateCharacteristicDto,
  ) {
    return this.characteristicService.update(
      characteristicName,
      updateCharacteristicDto,
    );
  }

  @Role(RoleEnum.ADMIN)
  @Delete(':characteristic')
  remove(@Param('characteristic') characteristicName: string) {
    return this.characteristicService.remove(characteristicName);
  }
}
