import styled from "styled-components";
import { useState } from "react";
import { useNavigate  } from "react-router-dom";
import { getMovies, GetMoviesResult } from "../api";
import { useQuery } from "@tanstack/react-query";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  width: 100%;
  height: 2000px;
  margin-top: 60px;
  background: #111;
  overflow: hidden;
`;
const Loader = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  color: red;
`;
const Banner = styled.div<{ bgPhoto: string | undefined }>`
  color: #111;
  width: 100%;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 60px;
  background: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)),
    url(${(props) => props.bgPhoto}) center/cover no-repeat;
`;
const Title = styled.div`
  font-size: 46px;
  margin-bottom: 10px;
  font-weight: bold;
`;
const OverView = styled.p`
  font-size: 16px;
  line-height: 28px;
  width: 50%;
`;
interface BgPhoto {
  bgPhoto: string | undefined;
}
const Slider = styled.div`
  position: relative;
  width: 100%;
`;
const Row = styled(motion.div)`
  position: absolute;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin-bottom: 10px;
`;
const Box = styled(motion.div)<{ bgPhoto: string | undefined }>`
  width: auto;
  height: 200px;
  transform: translateY(-40px);
  background: url(${(props) => props.bgPhoto}) center/cover no-repeat;
  font-size: 22px;
  position: relative;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  width: 100%;
  height: 100%;
  padding: 20px;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  h4 {
    text-align: center;
    font-size: 16px;
    color: red;
  }
`;

const rowVariants = {
  hidden: {
    x: window.innerWidth + 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth - 10,
  },
};

const boxVariants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.3, duration: 0.3, type: "tween" },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.3, duration: 0.3, type: "tween" },
  },
};

const ModalBox = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 40vw;
  height: 80vh;
  background: #111;
  color: #111;
  border-radius: 8px;
  overflow: hidden;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
`;

const MovieCover = styled.div`
  width: 100%;
  height: 400px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;
const MovieTitle = styled.h3`
  color: #111;
  font-size: 28px;
  padding: 20px;
  position: relative;
  top: -80px;
`;

const MovieOverView = styled.div`
  padding: 20px;
  line-height: 2;
  font-size: 20px;
  position: relative;
  top: -60px;
`;

const offset = 6;

const Home = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<GetMoviesResult>({
    queryKey: ["nowPlaying"],
    queryFn: getMovies,
  });
  const [index, setindex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [hoveredMovie, setHoveredMovie] = useState<
    GetMoviesResult["results"][0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { scrollY } = useScroll();

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = data?.results.length - 2;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;

      setindex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxMouseEnter = (movie: GetMoviesResult["results"][0]) => {
    setHoveredMovie(movie);
    setIsModalOpen(true);
  };

  const onOverlayCloseClick = () => {
    setIsModalOpen(false);
    setHoveredMovie(null);
  };

  return (
    <Container className={`overflow-hidden w-full h-[2000px] mt-15`}>
      {isLoading ? (
        <Loader className="flex justify-center items-center w-full h-full text-[22px] text-red-500">
          Loading...
        </Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[9].backdrop_path || "")}
          >
            <Title>{data?.results[9].original_title}</Title>
            <OverView>{data?.results[9].overview}</OverView>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                key={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {data?.results
                  .slice(2)
                  .slice(index * offset, index * offset + offset)
                  .map((movie) => (
                    <>
                      <Box
                        onMouseEnter={() => onBoxMouseEnter(movie)}
                        key={movie.id}
                        layoutId={`movie-${movie.id}`}
                        variants={boxVariants}
                        bgPhoto={makeImagePath(movie.backdrop_path || "")}
                        initial="normal"
                        whileHover="hover"
                      >
                        {movie.title}
                        <img src="" alt="" />
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                      <AnimatePresence>
                        {isModalOpen && movie.id === hoveredMovie?.id ? (
                          <>
                            <Overlay
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <button
                                className="absolute top-10 right-10 text-2xl text-white"
                                onClick={onOverlayCloseClick}
                              >
                                <FontAwesomeIcon icon={faCircleXmark} />
                              </button>
                            </Overlay>
                            <ModalBox
                              style={{ top: scrollY.get() + 60 }}
                              layoutId={`movie-${hoveredMovie?.id}`}
                              onClick={() =>
                                navigate(`/movies/${hoveredMovie?.id}`)
                              }
                            >
                              {hoveredMovie && (
                                <>
                                  <MovieCover
                                    style={{
                                      backgroundImage: `linear-gradient(to top, #000, transparent), url(${makeImagePath(
                                        hoveredMovie.backdrop_path,
                                        "w500"
                                      )})`,
                                    }}
                                  />
                                  <MovieTitle>{hoveredMovie.title}</MovieTitle>
                                  <MovieOverView>
                                    {hoveredMovie.overview}
                                  </MovieOverView>
                                </>
                              )}
                            </ModalBox>
                          </>
                        ) : null}
                      </AnimatePresence>
                    </>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Container>
  );
};
export default Home;
