import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as pactum from 'pactum'
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDTO } from '../src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('App (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService

  beforeEach(async () => {

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      })
    )

    await app.init();
    await app.listen(3001)
    prisma = app.get(PrismaService)
    await prisma.cleanDb()
    pactum.request.setBaseUrl('http://localhost:3000')

  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  })

  describe('Auth', () => {
    
    const dto: AuthDTO = {
      email: 'alireza9@gmail.com',
      password: '123'
    }
  
    // Test auth singup 
    describe('Sign up', () => {

      it('should throw if email empty',()=>{
        return pactum.spec().post('/auth/signup').withBody({password:dto.password}).
        expectStatus(400)
      }) 

      it('should throw if password empty',()=>{
        return pactum.spec().post('/auth/signup').withBody({email:dto.email}).
        expectStatus(400)
      }) 

      it('should throw if no body provided',()=>{
        return pactum.spec().post('/auth/signup').
        expectStatus(400)
      }) 

      it('should singup', () => {
        return pactum.spec().post('/auth/signup').withBody(dto).
          expectStatus(201) 
      })
    })

    // Test auth singin 
    describe('Sign in', () => {

      it('should throw if email empty',()=>{
        return pactum.spec().post('/auth/signin').withBody({password:dto.password}).
        expectStatus(400)
      }) 

      it('should throw if password empty',()=>{
        return pactum.spec().post('/auth/signin').withBody({email:dto.email}).
        expectStatus(400)
      }) 

      it('should throw if no body provided',()=>{
        return pactum.spec().post('/auth/signin').
        expectStatus(400)
      })

      it('should singin', () => {
        return pactum.spec().post('/auth/signin').withBody(dto).
        expectStatus(200).stores('userAt',"access_token")
      })
    }) 


  })
  // Test route user 
  describe('User', () => {
    describe('Get me', () => { 

      it("should get currnet user",()=>{
        return pactum.spec().get('/users/me').withHeaders({
          Authorization:'Bearer $S{userAt}'
        }).expectStatus(200)
      })
      
    })
    describe('Edit user', () => {
      let dto:EditUserDto = {
        firstName:"Alireza",
        email:'alireza00@gmail.com'
      }
      it("should edit user",()=>{
        return pactum.spec().patch('/users').withHeaders({
          Authorization:'Bearer $S{userAt}'
        }).withBody({dto})
        .expectStatus(200)
      })
     })
  })
  // Test route bookmark 
  describe('Bookmarks', () => {
    describe('get empty Bookmark', () => { 
      it("should get Bookmark",()=>{
        return pactum.spec().get("/bookmarks").withHeaders({
          Authorization:'Bearer $S{userAt}'
        }).expectStatus(200)
      })
    })

    describe('Create bookmark', () => {
      const dto:CreateBookmarkDto ={
        titel:'First bookmark',
        link:"www.AlirezaBohlool.com"
      } 
      it('should create bookmark',()=>{
        return pactum.spec().post("/bookmarks").withHeaders({
          Authorization:'Bearer $S{userAt}'
        }).withBody(dto).expectStatus(201).stores("bookmarkId","id")
      })
    })

    describe('Get bookmarks', () => { 
      it("should get Bookmark",()=>{
        return pactum.spec().get("/bookmarks").withHeaders({
          Authorization:'Bearer $S{userAt}'
        }).expectStatus(200)
      })
    })

    describe('edit bookmark by id', () => { 
      const dto:EditBookmarkDto = {
        discription:"YouTube",
      }
      it("should edit Bookmark",()=>{
        return pactum.spec().patch("/bookmarks/{id}").withPathParams('id','${bookmarkId}').withHeaders({
          Authorization:'Bearer $S{userAt}'
        }).withBody(dto).expectStatus(200)  
      })
    })

    describe('Delete bookmark by id', () => { 
      it("should delete Bookmark",()=>{
        return pactum.spec().delete("/bookmarks/{id}").withPathParams('id','${bookmarkId}').withHeaders({
          Authorization:'Bearer $S{userAt}'
        }).expectStatus(204)  
      })

      it("should get empty bookmark",()=>{
        return pactum.spec().get("/bookmarks").withHeaders({
          Authorization:'Bearer $S{userAt}'
        }).expectStatus(200).expectJsonLength(0)
      })

    })

  })
});


