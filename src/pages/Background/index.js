import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import { wrapStore } from 'webext-redux';
import { reduxStore } from '../../Redux/Store/store';
import { restrictSelectedTitleLength } from '../../../utils/helpers';
import { createNewPost } from '../Popup/Popup';
import { writeData } from '../../firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
import { addPost } from '../../Redux/Actions/postAction';
wrapStore(reduxStore);
const availableContextMenuPages = ['https://www.facebook.com/*'];

chrome.runtime.onInstalled.addListener(() => {
  const contextMenuItem = {
    id: 'selectedData',
    title: '>AskFriendsBackup<',
    contexts: ['all'],
    documentUrlPatterns: availableContextMenuPages,
  };
  chrome.contextMenus.create(contextMenuItem);
});

chrome.contextMenus.onClicked.addListener(async (menuContextData) => {
  const { menuItemId, frameUrl, pageUrl, selectionText } = menuContextData;
  if (menuItemId === 'selectedData' && selectionText && frameUrl) {
    const newTitle = restrictSelectedTitleLength(selectionText);
    const newPost = createNewPost(newTitle, frameUrl);
    try {
      await writeData(newPost);
      const { dispatch } = reduxStore;
      dispatch(addPost(newPost));
    } catch (err) {
      console.error('Something went wrong', err);
    }
  }
});
//TODO:REMOVE CONSOLE LOGS AND COMMENTS
console.log('background scripts here.', reduxStore);

// chrome.runtime.onMessage.addListener((response, sender, sendResponse) => {
//   console.log('response', response);
// });
