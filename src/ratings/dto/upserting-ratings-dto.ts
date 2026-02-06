import { IsInt, Max, Min } from 'class-validator';

export class UpsertRatingDto {
  @IsInt()
  tmdbMovieId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
