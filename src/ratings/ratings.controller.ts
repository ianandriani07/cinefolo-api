import { Body, Controller, Put, Param, ParseIntPipe, Get, Delete, HttpCode } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { IsInt, Max, Min } from 'class-validator';

class UpsertRatingBody {
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;
}

@Controller('ratings')
export class RatingsController {
    
    constructor(private ratings: RatingsService) {}

    @Put(':tmdbMovieId')
    upsert(
        @Param('tmdbMovieId', ParseIntPipe) tmdbMovieId: number,
        @Body() body: UpsertRatingBody,
    ) {
        return this.ratings.upsertByMovie(tmdbMovieId, body.rating);
    }

    @Get(':tmdbMovieId')
    getByMovie(
        @Param('tmdbMovieId', ParseIntPipe) tmdbMovieId: number,
    ) {
        return this.ratings.getByMovie(tmdbMovieId);
    }

        @Get()
        getAll() {
            return this.ratings.getAll();
        }

    @Delete(':tmdbMovieId')
    @HttpCode(204)
    deleteRating(
        @Param('tmdbMovieId', ParseIntPipe) tmdbMovieId: number,
    ) {
        return this.ratings.deleteRating(tmdbMovieId);
    }
}
