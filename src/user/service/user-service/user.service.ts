import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AuthService } from 'src/auth/service/auth.service';
import { UserEntity } from 'src/user/model/user.entity';
import { UserI } from 'src/user/model/user.interface';
import { Like, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  public async create(newUser: UserI): Promise<UserI> {
    try {

      const mailExists: boolean = await this.mailExists(newUser.email);
      const usernameExists: boolean = await this.usernameExists(
        newUser.username,
      );
      console.log(mailExists, usernameExists);
      if (!mailExists && !usernameExists) {
        const passwordHash: string = await this.hashPassword(newUser.password);
        newUser.password = passwordHash;
        
        const user = await this.userRepository.save(
          this.userRepository.create(newUser),
        );
        return this.findOne(user.id);
      } else {
        throw new HttpException(
          'Email or username is already in use',
          HttpStatus.CONFLICT,
        );
      }
    } catch (error) {
      console.log("pasa aca error");
      console.log(error);
      throw new HttpException(
        'Email or username is already in use',
        HttpStatus.CONFLICT,
      );
    }
  }

  public async login(user: UserI): Promise<string> {
    try {
      const foundUser: UserI = await this.findByEmail(user.email.toLowerCase());
      if (foundUser) {
        const matches: boolean = await this.validatePassword(
          user.password,
          foundUser.password,
        );
        if (matches) {
          const payload: UserI = await this.findOne(foundUser.id);
          return this.authService.generateJwt(payload);
        } else {
          throw new HttpException(
            'Login was not successfull, wrong credentials',
            HttpStatus.UNAUTHORIZED,
          );
        }
      } else {
        throw new HttpException(
          'Login was not successfull, wrong credentials',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  public async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<UserI>> {
    return paginate<UserEntity>(this.userRepository, options);
  }

  public async findAllByUsername(username: string): Promise<UserI[]> {
    return await this.userRepository.find({
      where: {
        username: Like(`%${username.toLowerCase()}%`),
      },
    });
  }

  private async findByEmail(email: string): Promise<UserI> {
    return await this.userRepository.findOne(
      { email },
      { select: ['id', 'email', 'username', 'password'] },
    );
  }

  public async isMemberOfRoom(roomId: number, token: string): Promise<boolean> {
    const decodeToken = await this.authService.verifyJwt(token);
    const userId = decodeToken.user.id;
    const user = await this.userRepository.findOne(userId, {
      relations: ['rooms'],
    });
    const room = user.rooms.find((room) => room.id == roomId);
    if (room) {
      return true;
    } else {
      return false;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await this.authService.hashPassword(password);
  }

  private async validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<any> {
    return this.authService.comparePasswords(password, storedPasswordHash);
  }

  private async findOne(id: number): Promise<UserI> {
    return this.userRepository.findOne({ id });
  }

  public async getOne(id: number): Promise<UserI> {
    return this.userRepository.findOneOrFail({ id });
  }

  private async mailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  private async usernameExists(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ username });
    if (user) {
      return true;
    } else {
      return false;
    }
  }
}
