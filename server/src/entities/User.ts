import {Entity, Column, Index, OneToMany, BeforeInsert} from "typeorm"
import {IsEmail, Length} from "class-validator";
import BaseEntity from "./Entity";
import Post from "./Post";
import Vote from "./Vote";
import bcrypt from 'bcryptjs'

@Entity("users")
export class User extends BaseEntity{
    @Index()
    @IsEmail(undefined, {message: "Wrong or Invalid email address. Please correct and try again."})
    @Length(1, 64, {message: "Enter your email address."})
    @Column({unique: true})
    email: string

    @Index()
    @Length(3, 32, {message: "Minimum 3 characters required"})
    @Column({unique: true})
    username: string

    @Column()
    @Length(6, 32, {message: "Minimum 6 characters required"})
    password: string

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[]

    @OneToMany(() => Vote, (vote) => vote.user)
    votes: Vote[]

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 6)
    }
}
