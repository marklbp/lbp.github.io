# PLUGINS

This directory contains your Javascript plugins that you want to run before instantiating the root vue.js application.

More information about the usage of this directory in the documentation:
https://nuxtjs.org/guide/plugins

**This directory is not required, you can delete it if you don't want to use it.**


### vee-validate 领域验证

```
form data-vv-scope="form-1" 
//同样可以在input上添加
this.$validator.validateAll('form-1').then((result) => {
        if (result) {
          // eslint-disable-next-line
          alert('Form Submitted!');
        }
});

//清除所有报错
this.$validator.reset();

```
