import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { throws } from 'assert';

@Injectable()
export class BookmarkService {

    constructor(private prismaService: PrismaService) { }


    getBookmarks(userId: number) {
        return this.prismaService.bookmark.findMany({
            where: {
                userId,
            }
        })
    }


    getBookmarkById(userId: number, bookmardId: number) {
        return this.prismaService.bookmark.findFirst({
            where: {
                id:bookmardId,
                userId,
            }
        })
    }

    async createBookmark(userId: number, dto: CreateBookmarkDto) {
 
        const bookmark = await this.prismaService.bookmark.create({
            data: {
                userId,
                titel: dto.titel,
                discription: dto.discription,
                link: dto.link
            },
        })

        return bookmark

    }

    async updateBookmarkById(userId: number, bookmardId: number, dto: EditBookmarkDto) {

        // Get bookmark by id 
        const bookmark = await this.prismaService.bookmark.findUnique({
            where:{
                id:bookmardId
            }
        })
        // check if user own bookmark
        if(!bookmark || bookmark.userId !== userId ){
            throw new ForbiddenException('Access ro resoures denied')
        }

        return this.prismaService.bookmark.update({
            where:{
                id:bookmardId,
            },
            data:{
                ...dto
            }
        })

    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {
        
        // Get bookmark by id 
        const bookmark = await this.prismaService.bookmark.findUnique({
            where:{
                id:bookmarkId
            }
        })
        // check if user own bookmark
        if(!bookmark || bookmark.userId !== userId ){
            throw new ForbiddenException('Access ro resoures denied')
        }

        await this.prismaService.bookmark.delete({
            where:{
                id:bookmarkId
            }
        })

    }
}
