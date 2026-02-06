import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingsService {
    constructor(private prisma: PrismaService) {}

    async upsertByMovie(tmdbMovieId: number, ratingValue: number) {
        if (ratingValue < 1 || ratingValue > 5) {
            throw new BadRequestException('rating must be between 1 and 5');
        }

        const userId = 1;

        const result = await this.prisma.rating.upsert({
        where: {
            uq_user_movie_rating: { userId, tmdbMovieId },
        },
        create: { userId, tmdbMovieId, rating: ratingValue },
        update: { rating: ratingValue },
        select: {
            userId: true,
            tmdbMovieId: true,
            rating: true,
            createdAt: true,
            updatedAt: true,
        },
        });

        return {
            tmdb_movie_id: result.tmdbMovieId,
            rating: result.rating,
            created_at: result.createdAt,
            updated_at: result.updatedAt,
        };
    }

    async getByMovie(tmdbMovieId: number) {
        const userId = 1;

        const rating = await this.prisma.rating.findUnique({
            where: {
                uq_user_movie_rating: { userId, tmdbMovieId },
            },
            select: {
                userId: true,
                tmdbMovieId: true,
                rating: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!rating) {
            throw new NotFoundException('Rating not found for this movie');
        }

        return {
            tmdb_movie_id: rating.tmdbMovieId,
            rating: rating.rating,
        };
    }

    async getAll() {
        const userId = 1;

        const ratings = await this.prisma.rating.findMany({
            where: { userId }
        });

        if (!ratings) {
            throw new NotFoundException('Rating not found for this movie');
        }

        return ratings.map(r => ({
            tmdb_movie_id: r.tmdbMovieId,
            rating: r.rating
        }));
    }


    async deleteRating(tmdbMovieId: number): Promise<void> {
        const userId = 1;

        try {
            await this.prisma.rating.delete({
                where: {
                    uq_user_movie_rating: {
                    userId,
                    tmdbMovieId,
                    },
                },
            });
        } catch {
            throw new NotFoundException('Rating not found for this movie');
        }
    }
}
