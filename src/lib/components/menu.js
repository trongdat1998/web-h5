import Menu, {
  SubMenu,
  MenuItem as Item,
  MenuItem,
  MenuItemGroup,
  ItemGroup,
  Divider
} from "rc-menu";

import "../css/menu.less";

Menu.SubMenu = SubMenu;
Menu.Item = Item;
Menu.MenuItem = MenuItem;
Menu.MenuItemGroup = MenuItemGroup;
Menu.ItemGroup = ItemGroup;
Menu.Divider = Divider;

export default Menu;
