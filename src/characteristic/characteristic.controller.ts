import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CharacteristicService } from './characteristic.service';
import { CreateCharacteristicDto } from './dto/create-characteristic.dto';
import { UpdateCharacteristicDto } from './dto/update-characteristic.dto';

@Controller('characteristic')
export class CharacteristicController {
  constructor(private readonly characteristicService: CharacteristicService) {}

  @Post()
  create(@Body() createCharacteristicDto: CreateCharacteristicDto) {
    return this.characteristicService.create(createCharacteristicDto);
  }

  @Get()
  findAll() {
    return this.characteristicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.characteristicService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCharacteristicDto: UpdateCharacteristicDto) {
    return this.characteristicService.update(+id, updateCharacteristicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.characteristicService.remove(+id);
  }
}
