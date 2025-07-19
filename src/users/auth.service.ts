import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { promisify } from "util";
import { scrypt as _scrypt, randomBytes } from "crypto";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        // See if email is in use
        const existingUser = await this.usersService.find(email);

        if (existingUser.length) {
            throw new BadRequestException(
                "Email already in use. Please use a different email.",
            );
        }

        // Hash the user's password

        // Generate a salt
        const salt = randomBytes(8).toString("hex");

        // Hash the password with the salt
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Join the hashed result and the salt
        const result = salt + "." + hash.toString("hex");

        // Create a new user and save it
        const user = await this.usersService.create(email, result);

        // return the user
        return user;
    }

    async signin(email: string, password: string) {
        // Find the user by email
        const [user] = await this.usersService.find(email);

        if (!user) {
            throw new BadRequestException("Invalid email or password");
        }

        // Extract the salt and hash from the stored password
        const [salt, storedHash] = user.password.split(".");

        // Hash the provided password with the same salt
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Compare the hashed password with the stored hash
        if (storedHash !== hash.toString("hex")) {
            throw new BadRequestException("Invalid email or password");
        }

        // Return the user without the password
        return `Signed in successfully with email ${user.email}`;
    }
}
