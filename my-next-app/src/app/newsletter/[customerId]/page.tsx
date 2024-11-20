import Newsletter from '@/components/newsletter';

const NewsletterPage = ({ params }: { params: { customerId: string } }) =>  {
  const { customerId } = params;
  if (!customerId) {
    return <Newsletter />;
  }

  return (
    <Newsletter customerId={parseInt(customerId)} />
  );
};

export default NewsletterPage;