import React from "react";
import { Dropdown, Menu } from "antd";
import { useStore } from "simstate";
import { languageNames } from "src/i18n";
import { DownOutlined, GlobalOutlined } from "@ant-design/icons";
import { ClickableA } from "src/components/ClickableA";
import { I18nStore } from "simstate-i18n";

export function HomepageLanguageSelector() {

  const { currentLanguage, changeLanguage } = useStore(I18nStore);

  return (
    <Dropdown trigger={["click", "hover"]} overlay={(
      <Menu selectedKeys={[currentLanguage.id]}>
        {Object.entries(languageNames)
          .filter(([id]) => id !== currentLanguage.id)
          .map(([id, name]) => (
            <Menu.Item key={id}>
              <ClickableA onClick={() => changeLanguage(id)}>
                {name}
              </ClickableA>
            </Menu.Item>
          ))
        }
      </Menu>)}
    >
      <ClickableA >
        <GlobalOutlined /> {currentLanguage.name} <DownOutlined />
      </ClickableA>
    </Dropdown>
  );

}

