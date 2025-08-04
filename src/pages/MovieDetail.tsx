import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getMovies, getVideos, getReviews, Movie, getMovies2 } from "../api";

const MovieDetail = () => {
  const { movieId } = useParams();
  const reviewsRef = useRef(null);

  // getMovies2 데이터 가져오기
  const { data: moviesData2 } = useQuery({
    queryKey: ["movies2"],
    queryFn: getMovies2,
  });

  console.log("getMovies2 data:", moviesData2);
  // 영화 목록에서 해당 영화 찾기
  const {
    data: moviesData,
    isLoading: isMoviesLoading,
    error: moviesError,
  } = useQuery({
    queryKey: ["movies"],
    queryFn: getMovies,
  });

  // 해당 movieId와 일치하는 영화 찾기
  const currentMovie = moviesData?.results?.find(
    (movie: Movie) => movie.id === Number(movieId)
  );

  // 비디오 데이터 가져오기
  const {
    data: videosData,
    isLoading: isVideosLoading,
    error: videosError,
  } = useQuery({
    queryKey: ["videos", movieId],
    queryFn: () => getVideos(Number(movieId)),
    enabled: !!movieId, // movieId가 있을 때만 실행
  });

  // 리뷰 데이터 가져오기
  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    error: reviewsError,
  } = useQuery({
    queryKey: ["reviews", movieId],
    queryFn: () => getReviews(Number(movieId)),
    enabled: !!movieId, // movieId가 있을 때만 실행
  });

  // 로딩 상태 확인
  const isLoading = isMoviesLoading || isVideosLoading || isReviewsLoading;

  // 에러 처리
  if (moviesError || videosError || reviewsError) {
    return (
      <div className="mx-auto mt-[60px] w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="flex justify-center items-center mb-4 w-16 h-16 bg-red-100 rounded-full">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            데이터를 불러올 수 없습니다
          </h2>
          <p className="mb-4 text-gray-600">잠시 후 다시 시도해주세요</p>
          <motion.button
            className="px-6 py-3 text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
          >
            새로고침
          </motion.button>
        </div>
      </div>
    );
  }

  // 스켈레톤 박스 컴포넌트
  const SkeletonBox = ({
    width,
    height,
    className = "",
    delay = 0,
  }: {
    width: string;
    height: string;
    className?: string;
    delay?: number;
  }) => (
    <motion.div
      className={`overflow-hidden relative bg-gray-200 rounded ${className}`}
      style={{ width, height }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      {/* Shimmer 오버레이 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
          delay: delay + 0.5,
          repeatDelay: 0.5,
        }}
      />
    </motion.div>
  );

  // 스켈레톤 UI 컴포넌트
  const SkeletonUI = () => (
    <motion.div
      className="mx-auto mt-[60px] w-4xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 영화 기본 정보 스켈레톤 */}
      <motion.section
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <div className="flex flex-col gap-6 md:flex-row">
          {/* 포스터 스켈레톤 */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <SkeletonBox
              width="256px"
              height="384px"
              className="shadow-lg"
              delay={0}
            />
          </motion.div>

          {/* 영화 정보 스켈레톤 */}
          <motion.div
            className="flex-1 space-y-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <SkeletonBox width="75%" height="32px" delay={0.1} />
            <SkeletonBox width="50%" height="24px" delay={0.2} />
            <SkeletonBox width="40%" height="24px" delay={0.3} />
            <SkeletonBox width="30%" height="24px" delay={0.4} />
            <div className="mt-4 space-y-2">
              <SkeletonBox width="100%" height="16px" delay={0.5} />
              <SkeletonBox width="95%" height="16px" delay={0.6} />
              <SkeletonBox width="80%" height="16px" delay={0.7} />
              <SkeletonBox width="70%" height="16px" delay={0.8} />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 비디오 섹션 스켈레톤 */}
      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="mb-4">
          <SkeletonBox width="25%" height="32px" delay={0.9} />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={index}
              className="overflow-hidden bg-white rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.5 + index * 0.1,
                duration: 0.6,
                ease: "easeOut",
              }}
            >
              <SkeletonBox
                width="100%"
                height="200px"
                className="aspect-video"
                delay={1.0 + index * 0.1}
              />
              <div className="p-4 space-y-3">
                <SkeletonBox
                  width="75%"
                  height="20px"
                  delay={1.1 + index * 0.1}
                />
                <div className="flex justify-between items-center">
                  <SkeletonBox
                    width="25%"
                    height="16px"
                    delay={1.2 + index * 0.1}
                  />
                  <SkeletonBox
                    width="20%"
                    height="16px"
                    delay={1.3 + index * 0.1}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 리뷰 섹션 스켈레톤 */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="mb-4">
          <SkeletonBox width="15%" height="32px" delay={1.6} />
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.9 + index * 0.1,
                duration: 0.6,
                ease: "easeOut",
              }}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <SkeletonBox
                    width="30%"
                    height="20px"
                    delay={1.7 + index * 0.1}
                  />
                  <SkeletonBox
                    width="15%"
                    height="16px"
                    delay={1.8 + index * 0.1}
                  />
                </div>
                <div className="space-y-2">
                  <SkeletonBox
                    width="100%"
                    height="16px"
                    delay={1.9 + index * 0.1}
                  />
                  <SkeletonBox
                    width="95%"
                    height="16px"
                    delay={2.0 + index * 0.1}
                  />
                  <SkeletonBox
                    width="85%"
                    height="16px"
                    delay={2.1 + index * 0.1}
                  />
                  <SkeletonBox
                    width="60%"
                    height="16px"
                    delay={2.2 + index * 0.1}
                  />
                </div>
                <SkeletonBox
                  width="20%"
                  height="12px"
                  delay={2.3 + index * 0.1}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );

  // 로딩 중
  if (isLoading) {
    return <SkeletonUI />;
  }

  // 영화를 찾지 못한 경우
  if (!currentMovie) {
    return (
      <div className="mx-auto mt-[60px] w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="flex justify-center items-center mb-4 w-16 h-16 bg-gray-100 rounded-full">
            <span className="text-2xl">🎬</span>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            영화를 찾을 수 없습니다
          </h2>
          <p className="mb-4 text-gray-600">
            요청하신 영화가 목록에 없거나 삭제되었을 수 있습니다
          </p>
          <motion.button
            className="px-6 py-3 text-white bg-gray-500 rounded-lg transition-colors hover:bg-gray-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
          >
            이전 페이지로
          </motion.button>
        </div>
      </div>
    );
  }

  console.log("Current movie:", currentMovie);
  console.log("Videos data:", videosData);
  console.log("Reviews data:", reviewsData);

  return (
    <div className="mx-auto mt-[60px] w-4xl">
      {/* 영화 기본 정보 섹션 */}
      <section className="mb-8">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* 포스터 이미지 */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 },
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`}
              alt={currentMovie.title}
              className="object-cover w-64 h-96 rounded-lg shadow-lg"
            />
          </motion.div>

          {/* 영화 정보 */}
          <div className="flex-1">
            <h1 className="mb-4 text-3xl font-bold">{currentMovie.title}</h1>
            <p className="mb-2 text-lg text-gray-600">
              {currentMovie.original_title}
            </p>
            <p className="mb-4 text-yellow-500">
              ⭐ {currentMovie.vote_average.toFixed(1)} (
              {currentMovie.vote_count} 투표)
            </p>
            <p className="mb-4 text-gray-500">
              개봉일: {currentMovie.release_date}
            </p>
            <p className="leading-relaxed text-gray-700">
              {currentMovie.overview}
            </p>
          </div>
        </div>
      </section>

      {/* 비디오 섹션 */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">관련 영상</h2>
        {videosData?.results?.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {videosData.results.slice(0, 4).map((video: any) => (
              <motion.div
                key={video.id}
                className="overflow-hidden bg-black rounded-lg shadow-lg"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="aspect-video">
                  {video.site === "YouTube" ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : video.site === "Vimeo" ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${video.key}`}
                      title={video.name}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex justify-center items-center w-full h-full text-white bg-gray-800">
                      <div className="text-center">
                        <p className="mb-2">외부 링크</p>
                        <a
                          href={`https://www.${video.site.toLowerCase()}.com/watch?v=${
                            video.key
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {video.site}에서 보기
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-white">
                  <h3 className="mb-2 text-lg font-semibold">{video.name}</h3>
                  <div className="flex justify-between items-center">
                    <motion.span
                      className="px-2 py-1 text-sm text-gray-600 bg-gray-100 rounded"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {video.type}
                    </motion.span>
                    <span className="text-sm text-gray-500">{video.site}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">관련 영상이 없습니다.</p>
        )}
      </section>

      {/* 리뷰 섹션 */}
      <section ref={reviewsRef} className="space-y-6">
        <h2 className="mb-4 text-2xl font-bold">리뷰</h2>
        {reviewsData?.results?.length > 0 ? (
          <div className="space-y-6">
            {reviewsData.results.slice(0, 5).map((review: any) => (
              <motion.div
                key={review.id}
                className="p-6 bg-gray-50 rounded-lg"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 25px -10px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.3 },
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold">
                    작성자: {review.author}
                  </h3>
                  <motion.span
                    className="text-yellow-500"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    평점: {review.author_details?.rating || "N/A"}
                  </motion.span>
                </div>
                <p className="leading-relaxed text-gray-700">
                  {review.content.length > 300
                    ? `${review.content.substring(0, 300)}...`
                    : review.content}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  작성일: {new Date(review.created_at).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">리뷰가 없습니다.</p>
        )}
      </section>
    </div>
  );
};

export default MovieDetail;
