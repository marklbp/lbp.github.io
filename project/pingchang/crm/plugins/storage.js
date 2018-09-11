/**
 * 本地存储扩展
 */
class Storage {
    constructor() {

    }

    get(key) {
        if (!this.isLocalStorage()) {
            return false;
        }
        var value = this.getStorage().getItem(key);
        if (value && value != 'undefined') {
            return JSON.parse(value);
        } else {
            return false;
        }
    }

    set(key, value) {
        if (!this.isLocalStorage()) {
            return;
        }
        value = JSON.stringify(value);
        this.getStorage().setItem(key, value);
    }

    remove(key) {
        if (!this.isLocalStorage()) {
            return;
        }
        this.getStorage().removeItem(key);
    }

    clear(){
        if (!this.isLocalStorage()) {
            return false;
        }
        try{        
            this.getStorage().clear();
            return true;
        }catch(e){
            return false
        }
    }

    getStorage() {
        return localStorage;
    }

    isLocalStorage() {
        try {
            if (!window.localStorage) {
                return false;
            }
            localStorage.setItem('FORTEST', 1); //试探可否成功写入
            return true;
        } catch (e) {
            return false;
        }
    }
};

export default new Storage();
