import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import AudioFooter from "components/AudioFooter";
import S3Image from "components/Image";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import { EditDeletePostBtns } from "../components/EditDeletePostBtns";
import { Layout } from "../components/Layout";
import { UpvoteSection } from "../components/UpvoteSection";
import {
  useGetAudioFileQuery,
  usePostsQuery,
  useSetAudioFileMutation,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import axios from "axios";
import WaveForm from "components/WaveForm";
import PlayPauseAudio from "components/PlayPauseAudio";
import AudioBar from "components/AudioBar";
import { format } from "timeago.js";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 12,
    cursor: null as null | string,
  });
  const [{ data, error, fetching }] = usePostsQuery({
    variables,
  });

  const [postPlaying, setPostPlaying] = useState(0);

  const assignPostPlaying = (postId: number) => {
    setPostPlaying(postId);
    console.log(postId);
  };

  if (!fetching && !data) {
    return (
      <div>
        <div>no more posts to show... or something went wrong</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Layout>
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
        <HStack align="center" justify="center" flexWrap="wrap" width="100%">
          {data!.posts.posts.map((p, i) =>
            !p ? null : (
              <Box display="flex" flexDirection="row" justifyContent="center" width="380px" style={{ margin: "0px" }}>
                <Flex
                  style={{ margin: "20px 0px" }}
                  key={p.id}
                  p={5}
                  display="flex"
                  flexDirection="column"
                  borderWidth="1px"
                  width="80%"
                  justifyContent="space-between"
                  bgColor="blackAlpha.400"
                  borderBottomRadius="30px"
                  borderColor="pink.200"
                >
                  <Box display="flex" justifyContent="center">
                    {p.imageFileName !== null ? <S3Image post={p} /> : null}
                  </Box>
                  <Box width="100%" mt={5}>
                    <Box ml="2px">
                      <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                        <Link>
                          <Heading fontSize="xl" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis" >{p.title}</Heading>
                        </Link>
                      </NextLink>
                    </Box>
                    <Box ml="5px" mt={2}>
                      <Heading mb={4} fontSize="md" color="white">
                        {p.creator.username}
                      </Heading>
                    </Box>
                    <Flex
                      justifyContent="space-between"
                      mt="3"
                      ml="1"
                      width="100%"
                      direction="column"
                      height="60%"
                    >
                      <Flex
                        direction="row"
                        justifyContent="space-between"
                        alignItems="end"
                        width="100%"
                        mt={2}
                      >
                        <Text color="white" fontSize="md" mr={2}>
                          {format(p.createdAt)}
                        </Text>
                      </Flex>
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            )
          )}
        </HStack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            isLoading={fetching}
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            colorScheme="teal"
            variant="solid"
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
      {/* <AudioFooter /> */}
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
