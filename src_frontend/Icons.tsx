import { library, icon, Icon } from '@fortawesome/fontawesome-svg-core'
import {
  faDatabase, faChartBar,
  faLongArrowAltUp, faLongArrowAltDown,
  faSortAmountUp, faSortAmountDown,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons'

// https://fontawesome.com/how-to-use/with-the-api/setup/library
library.add(faDatabase)
library.add(faChartBar)
library.add(faLongArrowAltUp)
library.add(faLongArrowAltDown)
library.add(faSortAmountUp)
library.add(faSortAmountDown)
library.add(faAngleDown)

const iDatabase = icon({ prefix: 'fas', iconName: 'database' })
const iChartBar = icon({ prefix: 'fas', iconName: 'chart-bar' })
const iLongArrowAltUp = icon({ prefix: 'fas', iconName: 'long-arrow-alt-up' })
const iLongArrowAltDown = icon({ prefix: 'fas', iconName: 'long-arrow-alt-down' })
const iSortAmountUp = icon({ prefix: 'fas', iconName: 'sort-amount-up' })
const iSortAmountDown = icon({ prefix: 'fas', iconName: 'sort-amount-down' })
const iAngleDown = icon({ prefix: 'fas', iconName: 'angle-down' })

function convert(icon: Icon) {
  // Note: icon.node is an HTMLCollection https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
  let fragment = []; // <></>
  for (let node of Array.from(icon.node)) {
    fragment.push(node);
  }
  return fragment;
}

export function IconDatabase() {
  return convert(iDatabase);
}
export function IconChartBar() {
  return convert(iChartBar);
}
export function IconLongArrowAltUp() {
  return convert(iLongArrowAltUp);
}
export function IconLongArrowAltDown() {
  return convert(iLongArrowAltDown);
}
export function IconSortAmountUp() {
  return convert(iSortAmountUp);
}
export function IconSortAmountDown() {
  return convert(iSortAmountDown);
}
export function IconAngleDown() {
  return convert(iAngleDown);
}