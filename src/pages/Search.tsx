import { useState, useEffect } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import {
  searchContents,
  GetMoviesResult,
  searchGeneres,
  getReviews,
  getVideos,
  Movie,
} from "../api";
import { makeImagePath } from "../utils";
import YouTube from "react-youtube";
import Pagination from "react-js-pagination";

const Container = styled.main`
  width: 100%;
  margin-top: 60px;
`;

const SearchBox = styled.div`
  width: 100%;
  padding: 10px;
`;

const MovieSection = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
`;

const MovieImg = styled.img`
  width: 50%;
`;

const MovieInfo = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const MovieTitle = styled.h4`
  font-size: 40px;
  background: ${(props) => props.theme.red};
  color: ${(porps) => porps.theme.white.darker};
  border-radius: 8px;
  padding: 0 10px;
`;

const MovieOverView = styled.p`
  font-size: 24px;
  line-height: 1.6;
  border-top: 1px solid ${(props) => props.theme.black.lighter};
  border-bottom: 1px solid ${(props) => props.theme.black.lighter};
  padding: 20px 0;
`;

const MovieDate = styled.div`
  font-size: 18px;
  span {
    display: block;
    background: #ffa330;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 8px;
  }
`;

const MovieValue = styled.div`
  font-size: 18px;
  width: 50px;
  height: 50px;
  background: ${(props) => props.theme.black.lighter};
  color: ${(props) => props.theme.white.darker};
  text-align: center;
  line-height: 50px;
`;

const Genres = styled.div`
  background: #ffa330;
  padding: 10px;
  border-radius: 8px;
`;

const MovieRate = styled.div`
  font-size: 18px;
  span {
    display: block;
    background: #ffa330;
    padding: 10px;
    border-radius: 8px;
  }
`;

const RateNumbers = styled.div`
  font-size: 18px;
  span {
    display: block;
    background: #ffa330;
    padding: 10px;
    border-radius: 8px;
  }
`;

const ReviewSection = styled.div`
  background: ${(props) => props.theme.white.darker};
  color: ${(props) => props.theme.black.lighter};
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  li {
    padding: 10px;
  }
`;
const ReviewAuthor = styled.div`
  background: ${(props) => props.theme.white.lighter};
  width: 150px;
  text-align: center;
  padding: 8px 0;
`;
const ReviewContent = styled.div``;

const VideoSection = styled.div`
  margin-top: 30px;
`;

const ImgBox = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => props.theme.black.lighter};
  border-radius: 8px;
`;

const StyledPagination = styled.div`
  width: 28%;
  display: flex;
  justify-content: center;
  background: crimson;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  ul {
    display: flex;
    gap: 5px;
    li {
      a {
        display: inline-block;
        color: ${(props) => props.theme.darker};
        transition: color 0.3s;
        &:hover {
          color: ${(props) => props.theme.black.darker};
        }
      }
    }
  }
`;

interface GenresItem {
  id: number;
  name: string;
}

interface ReviewContents {
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string;
    rating: number;
  };
  content: string;
  id: string;
  updated_at: string;
  url: string;
}

interface VideoContent<T> {
  [key: number]: T[];
}

const Search = () => {
  const [videos, setVideos] = useState<VideoContent<string>>({});
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get("keyword");

  const contents = searchContents(keyword);
  console.log(contents);

  const { data: movieData, isLoading: movieLoading } =
    useQuery<GetMoviesResult>({
      queryKey: ["multiContents", keyword],
      queryFn: () => searchContents(keyword),
    });

  const { data: genereData, isLoading: genereLoading } = useQuery({
    queryKey: ["getGeneres"],
    queryFn: searchGeneres,
  });

  const ids = movieData?.results.map((movie) => movie.id);
  console.log(movieData, genereData);

  const { data: reviewData, isLoading: reviewLoading } = useQuery({
    queryKey: ["getReviews", ids],
    queryFn: () =>
      ids ? Promise.all(ids.map((id) => getReviews(id))) : Promise.resolve([]),
    enabled: !!ids,
  });

  const { data: videoData, isLoading: videoLoading } = useQuery({
    queryKey: ["getVideos", ids],
    queryFn: () =>
      ids ? Promise.all(ids.map((id) => getVideos(id))) : Promise.resolve([]),
    enabled: !!ids,
  });

  console.log(videoData);

  console.log(videos);

  useEffect(() => {
    if (movieData && videoData) {
      movieData.results.forEach((movie) => {
        getVideos(movie.id).then((data) => {
          if (data.results) {
            const videoIds = data.results.map((video: any) => video.key);
            setVideos((prev) => ({
              ...prev,
              [movie.id]: videoIds,
            }));
          }
        });
      });
    }
  }, [movieData, videoData]);

  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(2);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;

  const currentMovies: Movie[] =
    movieData?.results.slice(indexOfFirstMovie, indexOfLastMovie) || [];

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      {movieLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {currentMovies?.map((movie, index) => (
            <SearchBox key={index}>
              <MovieSection>
                {movie.backdrop_path ? (
                  <MovieImg src={makeImagePath(movie.backdrop_path)} />
                ) : (
                  <ImgBox>Ready for images</ImgBox>
                )}
                <MovieInfo>
                  <MovieTitle>{movie.title}</MovieTitle>
                  <MovieOverView>{movie.overview}</MovieOverView>
                  <MovieDate>
                    <span>Release : {movie.release_date}</span>
                  </MovieDate>
                  <MovieRate>
                    <span>Rate : {movie.vote_average?.toFixed(2)}</span>
                  </MovieRate>
                  <RateNumbers>
                    <span>
                      Members : {movie.vote_count?.toLocaleString("ko-kr")}
                    </span>
                  </RateNumbers>
                  <MovieValue>{movie.adult ? "18+" : "ALL"}</MovieValue>
                  <Genres>
                    {movie.genre_ids
                      .map(
                        (id) =>
                          genereData?.genres.find(
                            (item: GenresItem) => item.id === id
                          ).name
                      )
                      .join(", ")}
                  </Genres>
                </MovieInfo>
              </MovieSection>
              <ReviewSection>
                <h3>🤠Movie Reviews🧐</h3>
                {reviewLoading ? (
                  <div>Review Loading</div>
                ) : (
                  <ul>
                    {reviewData && reviewData[index].results ? (
                      reviewData[index].results.map(
                        (review: ReviewContents) => (
                          <li key={review.id}>
                            <ReviewAuthor>{review.author}</ReviewAuthor>
                            <ReviewContent>{review.content}</ReviewContent>
                          </li>
                        )
                      )
                    ) : (
                      <li>No Reviews...</li>
                    )}
                  </ul>
                )}
              </ReviewSection>
              <VideoSection>
                {videos[movie.id]?.length > 0 ? (
                  <YouTube
                    videoId={videos[movie.id][0]}
                    opts={{ width: "100%", height: "800px" }}
                  />
                ) : (
                  <div>"No Available"</div>
                )}
              </VideoSection>
            </SearchBox>
          ))}
          <StyledPagination>
            <Pagination
              onChange={handlePageChange}
              activePage={currentPage}
              itemsCountPerPage={moviesPerPage}
              totalItemsCount={movieData?.results.length || 0}
              pageRangeDisplayed={5}
            />
          </StyledPagination>
        </>
      )}
    </Container>
  );
};

export default Search;
