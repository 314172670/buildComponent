import './BasicLayout.less';
import React, { useState } from 'react';
import { ContainerQuery } from 'react-container-query';
import DocumentTitle from 'react-document-title';
import { Layout } from 'antd';
import classNames from 'classnames';
import useMedia from 'react-media-hook2';
import Header from './Header';
import defaultGetPageTitle from './getPageTitle';
import defaultSettings from './defaultSettings';
import getLocales from './locales';
import Footer from './Footer';
import RouteContext from './RouteContext';
import SiderMenu from './SiderMenu';
import { getBreadcrumbProps } from './utils/getBreadcrumbProps';
import getMenuData from './utils/getMenuData';
import { isBrowser } from './utils/utils';
const { Content } = Layout;
const query = {
    'screen-xs': {
        maxWidth: 575,
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767,
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991,
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199,
    },
    'screen-xl': {
        minWidth: 1200,
        maxWidth: 1599,
    },
    'screen-xxl': {
        minWidth: 1600,
    },
};
const headerRender = (props) => {
    if (props.headerRender === false) {
        return null;
    }
    return <Header {...props} />
};
const footerRender = (props) => {
    if (props.footerRender === false) {
        return null;
      }
      if (props.footerRender) {
        return props.footerRender({ ...props }, <Footer />);
      }
      return <Footer />;
};
const renderSiderMenu = (props) => {
    const { layout, isMobile, menuRender } = props;
    if (props.menuRender === false) {
        return null;
    }
    if (layout === 'topmenu' && !isMobile) {
        return null;
    }
    if (menuRender) {
        return menuRender(props, <SiderMenu {...props} />);
    }
    return <SiderMenu {...props} />;
};
const defaultPageTitleRender = (pageProps, props) => {
    const { pageTitleRender } = props;
    if (pageTitleRender === false) {
        return props.title || '';
    }
    if (pageTitleRender) {
        const title = pageTitleRender(pageProps);
        if (typeof title === 'string') {
            return title;
        }
        console.warn('pro-layout: renderPageTitle return value should be a string');
    }
    return defaultGetPageTitle(pageProps);
};
function useCollapsed(collapsed, onCollapse) {
    const [nativeCollapsed, setCollapsed] = useState(false);
    if (collapsed !== undefined && onCollapse) {
        return [collapsed, onCollapse];
    }
    return [nativeCollapsed, setCollapsed];
}
const getPaddingLeft = (hasLeftPadding, collapsed, siderWidth) => {
    if (hasLeftPadding) {
        return collapsed ? 80 : siderWidth;
    }
    return undefined;
};
const BasicLayout = props => {
    const { children, onCollapse, location = { pathname: '/' }, fixedHeader, fixSiderbar, navTheme, layout: PropsLayout, route = {
        routes: [],
    }, siderWidth = 256, menu, menuDataRender, } = props;
    const formatMessage = ({ id, defaultMessage, ...rest }) => {
        if (props.formatMessage) {
            return props.formatMessage({
                id,
                defaultMessage,
                ...rest,
            });
        }
        const locales = getLocales();
        if (locales[id]) {
            return locales[id];
        }
        if (defaultMessage) {
            return defaultMessage;
        }
        return id;
    };
    const { routes = [] } = route;
    const { breadcrumb, menuData } = getMenuData(routes, menu, formatMessage, menuDataRender);
    /**
     * init variables
     */
    const isMobile = useMedia({
        id: 'BasicLayout',
        query: '(max-width: 599px)',
    })[0];
    // If it is a fix menu, calculate padding
    // don't need padding in phone mode
    const hasLeftPadding = fixSiderbar && PropsLayout !== 'topmenu' && !isMobile;
    // whether to close the menu
    const [collapsed, handleMenuCollapse] = useCollapsed(props.collapsed, onCollapse);
    // Splicing parameters, adding menuData and formatMessage in props
    const defaultProps = {
        ...props,
        formatMessage,
        breadcrumb,
    };
    // gen page title
    const pageTitle = defaultPageTitleRender({
        pathname: location.pathname,
        ...defaultProps,
    }, props);
    // gen breadcrumbProps, parameter for pageHeader
    const breadcrumbProps = getBreadcrumbProps({
        ...props,
        breadcrumb,
    });
    return   <DocumentTitle title={pageTitle}>
                <ContainerQuery query={query}>
                {params => (
                    <div className={classNames(params, 'ant-design-pro', 'basicLayout')}>
                    <Layout>
                        {renderSiderMenu({
                        menuData,
                        handleMenuCollapse,
                        isMobile,
                        theme: navTheme,
                        collapsed,
                        ...defaultProps,
                        })}
                        <Layout
                        style={{
                            paddingLeft: getPaddingLeft(
                            !!hasLeftPadding,
                            collapsed,
                            siderWidth,
                            ),
                            minHeight: '100vh',
                        }}
                        >
                        {headerRender({
                            menuData,
                            handleMenuCollapse,
                            isMobile,
                            collapsed,
                            ...defaultProps,
                        })}
                        <Content
                            className="ant-pro-basicLayout-content"
                            style={!fixedHeader ? { paddingTop: 0 } : {}}
                        >
                            <RouteContext.Provider
                            value={{
                                breadcrumb: breadcrumbProps,
                                ...props,
                                menuData,
                                isMobile,
                                collapsed,
                                title: pageTitle.split('-')[0].trim(),
                            }}
                            >
                            {children}
                            </RouteContext.Provider>
                        </Content>
                        {footerRender({
                            isMobile,
                            collapsed,
                            ...defaultProps,
                        })}
                        </Layout>
                    </Layout>
                    </div>
                )}
                </ContainerQuery>
            </DocumentTitle>
};
BasicLayout.defaultProps = {
    logo: '',
    ...defaultSettings,
    location: isBrowser() ? window.location : undefined,
};
export default BasicLayout;
//# sourceMappingURL=BasicLayout.js.map