import { retrieveCopyTradingTokens } from './appwrite_functions';
import { getToken } from '../api';
export const saveListItemToStorage = token => {
    const account_id = getToken().account_id;
    let items = localStorage.getItem(`${account_id}_tokens`);
    items = JSON.parse(items);
    if (items !== null) {
        if (Array.isArray(token)) {
            items = token;
        } else {
            items.push(token);
        }
        items = JSON.stringify(items);
        localStorage.setItem(`${account_id}_tokens`, items);
    } else {
        if (Array.isArray(token)) {
            items = token;
        } else {
            items = [token];
        }
        items = JSON.stringify(items);
        localStorage.setItem(`${account_id}_tokens`, items);
    }
};

export const deleteItemFromStorage = async(token) => {
    const account_id = getToken().account_id;
    let items = localStorage.getItem(`${account_id}_tokens`);
    items = JSON.parse(items);
    if (items !== null) {
        const filtered_items = items.filter(item => item.token !== token);
        items = JSON.stringify(filtered_items);
        localStorage.setItem(`${account_id}_tokens`, items);
    }else{
        await retrieveListItem();
    }
};

export const retrieveListItem = async () => {
    const account_id = getToken().account_id;
    let item = localStorage.getItem(`${account_id}_tokens`);
    item = JSON.parse(item);
    if (item !== null) {
        if (item.length > 0) {
            return item;
        }
        item = await retrieveCopyTradingTokens();
        if (typeof item !== 'undefined') {
            saveListItemToStorage(item);
        } else {
            return [];
        }
    } else {
        item = await retrieveCopyTradingTokens();
        if (typeof item !== 'undefined') {
            saveListItemToStorage(item);
        } else {
            return [];
        }
    }

    return item;
};

export const newListTokens = token_list => {
    const account_id = getToken().account_id;
    let items = token_list;
    items = JSON.stringify(items);
    localStorage.setItem(`${account_id}_tokens`, items);
};

export const reCallTheTokens = async () => {
    const account_id = getToken().account_id;
    const all_tokens = await retrieveCopyTradingTokens();
    if (typeof all_tokens !== 'undefined') {
        if (localStorage.getItem(`${account_id}_tokens`)) {
            localStorage.removeItem(`${account_id}_tokens`);
        }
        newListTokens(all_tokens);

        return all_tokens;
    }

    return [];
};
