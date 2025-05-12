import React from "react";
import { Helmet } from "react-helmet-async";

interface MetaTagsProps {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

const MetaTags = ({ title, description, imageUrl, url }: MetaTagsProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />

      <meta property='og:type' content='website' />
      <meta property='og:url' content={url} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={imageUrl} />

      <meta property='twitter:card' content='summary_large_image' />
      <meta property='twitter:url' content={url} />
      <meta property='twitter:title' content={title} />
      <meta property='twitter:description' content={description} />
      <meta property='twitter:image' content={imageUrl} />

      <meta property='og:site_name' content={title} />

      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
    </Helmet>
  );
};

export default MetaTags;
