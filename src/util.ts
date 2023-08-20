// import { createStore, set, get, entries, del, clear } from 'idb-keyval';

// class ttsIndexDB {
//   cusStore = createStore('tts_cache', 'data');
//   CACHE_LENGTH = 10;
//   content = '';
//   constructor(content: string) {
//     clear(this.cusStore);
//     this.content = content;
//   }

//   init = async (content: string) => {
//     if (content) {
//       this.content = content;
//     } else {
//       this.content = await get()
//     }
//   }

//   splitContent() {

//   }

//   delSnippet = async (key: string) => {
//     return await del(key, this.cusStore);
//   };

//   getSnippet = async (key: string, cleanAllData = false) => {
//     const result = await get(key, this.cusStore);
//     if (cleanAllData) {
//       await clear(this.cusStore);
//     } else {
//       await del(key, this.cusStore);
//     }
//     return result;
//   };

//   setSnippet = async (key: string, val: any) => {
//     return await set(key, val, this.cusStore);
//   };

//   addNew = async (key: string, val: any) => {
//     const snippets = (await entries(this.cusStore)) || [];
//     // const latest = snippets[]
//     if (snippets.length > this.CACHE_LENGTH) {
//       return false;
//     }
//     await this.setSnippet(key, val);
//     return true;
//   };
// }
