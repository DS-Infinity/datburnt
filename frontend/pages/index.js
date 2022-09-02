import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/Layout';
import Content from '../modules/Landing';

export default function Landing() {
  return (
    <Layout
      page={{
        title: 'Welcome',
      }}
    >
      <Content />
    </Layout>
  );
}
