import Guide from '@/pages/Home/components/Guide';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import styles from './index.less';
import React from 'react';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={name.trim()} />
      </div>
    </PageContainer>
  );
};

export default HomePage;
