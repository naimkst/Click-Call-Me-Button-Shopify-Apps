import { useCallback, useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  InlineGrid,
  TextField,
  useBreakpoints,
  Divider,
  Thumbnail,
  DropZone,
  LegacyStack,
  ButtonGroup,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

// @ts-ignore
import myImage1 from "../assets/images/001.png";
// @ts-ignore
import myImage2 from "../assets/images/002.png";
// @ts-ignore
import myImage3 from "../assets/images/003.png";
// @ts-ignore
import myImage4 from "../assets/images/004.png";
// @ts-ignore
import myImage5 from "../assets/images/005.png";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    }
  );
  const responseJson = await response.json();
  // const webhookList = await admin.rest.resources.Webhook.all({
  //   session: session,
  // });

  return json({
    product: responseJson.data.productCreate.product,
  });
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const { smUp } = useBreakpoints();
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  const productId = actionData?.product?.id.replace(
    "gid://shopify/Product/",
    ""
  );

  return (
    <Page
    // fullWidth={true}
    // primaryAction={{ content: "View on your store", disabled: false }}
    >
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "1fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: "400", sm: "0" }}
            paddingInlineEnd={{ xs: "400", sm: "0" }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                How can you use this app?
              </Text>
              <Text as="p" variant="bodyMd">
                Install this app to your Shopify store and you will be able to
                add a phone number to your store.
              </Text>

              <img
                alt=""
                width="100%"
                height="100%"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src={myImage1}
              />

              <img
                alt=""
                width="100%"
                height="100%"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src={myImage2}
              />

              <img
                alt=""
                width="100%"
                height="100%"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src={myImage3}
              />

              <img
                alt=""
                width="100%"
                height="100%"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src={myImage4}
              />

              <img
                alt=""
                width="100%"
                height="100%"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src={myImage5}
              />
            </BlockStack>
          </Box>

          <Box paddingBlockEnd={"800"}></Box>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
