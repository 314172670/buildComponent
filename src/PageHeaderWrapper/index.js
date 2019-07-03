import { PageHeader, Tabs } from 'antd';
import React from 'react';
import './index.less';
import GridContent from '../GridContent';
import RouteContext from '../RouteContext';
const prefixedClassName = 'ant-pro-page-header-wrap';
/**
 * render Footer tabList
 * In order to be compatible with the old version of the PageHeader
 * basically all the functions are implemented.
 */
const renderFooter = ({ tabList, tabActiveKey, onTabChange, tabBarExtraContent, }) => {
    if (tabList && tabList.length) {
        return (
          <Tabs
            className={`${prefixedClassName}-tabs`}
            activeKey={tabActiveKey}
            onChange={key => {
              if (onTabChange) {
                onTabChange(key);
              }
            }}
            tabBarExtraContent={tabBarExtraContent}
          >
            {tabList.map(item => (
              <Tabs.TabPane tab={item.tab} key={item.key} />
            ))}
          </Tabs>
        );
      }
      return null;
};
const renderPageHeader = (content, extraContent) => {
    if (!content && !extraContent) {
        return null;
    }
    return (
        <div className={`${prefixedClassName}-detail`}>
          <div className={`${prefixedClassName}-main`}>
            <div className={`${prefixedClassName}-row`}>
              {content && (
                <div className={`${prefixedClassName}-content`}>{content}</div>
              )}
              {extraContent && (
                <div className={`${prefixedClassName}-extraContent`}>
                  {extraContent}
                </div>
              )}
            </div>
          </div>
        </div>
      );
};
const defaultPageHeaderRender = (props) => {
    const { title, content, pageHeaderRender, extraContent, ...restProps } = props;
    return (
        <RouteContext.Consumer>
          {value => {
            if (pageHeaderRender) {
              return pageHeaderRender({ ...props, ...value });
            }
            let pageHeaderTitle = title;
            if (!title && title !== false) {
              pageHeaderTitle = value.title;
            }
            return (
              <PageHeader
                {...value}
                title={pageHeaderTitle}
                {...restProps}
                footer={renderFooter(restProps)}
              >
                {renderPageHeader(content, extraContent)}
              </PageHeader>
            );
          }}
        </RouteContext.Consumer>
      );
};
const PageHeaderWrapper = props => {
    const { children } = props;
    return (
        <div style={{ margin: '-24px -24px 0' }}>
          <div className={`${prefixedClassName}-page-header-warp`}>
            <GridContent>{defaultPageHeaderRender(props)}</GridContent>
          </div>
          {children ? (
            <GridContent>
              <div className={`${prefixedClassName}-children-content`}>
                {children}
              </div>
            </GridContent>
          ) : null}
        </div>
      );
};
export default PageHeaderWrapper;
//# sourceMappingURL=index.js.map