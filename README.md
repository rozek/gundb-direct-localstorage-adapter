# gundb-direct-localstorage-adapter #

a trivial storage adapter for GunDB using localStorage

[GunDB](https://github.com/amark/gun)'s built-in storage adapters based on [RAD](https://github.com/amark/gun/wiki/RAD) are completely broken (RAD [will soon be replaced by something else](https://github.com/amark/gun/issues/1329#issuecomment-1556079655)). Until then, this storage adapter may be used, e.g., for testing and debugging purposes.

In contrast to the author's [in-memory storage adapter](https://github.com/rozek/gundb-in-memory-storage-adapter), this one persists its contents in a browsers [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

"direct" means that a node's complete id (its "soul") is used as a key for localStorage to store that node's contents. While this may work well for short souls, it will consume a lot of memory as soon as the node ids get longer...

Please be aware that, in most browsers, "localStorage" has an overall size limit of 10MB (or 5*1024*1024 UTF-16 characters, counting keys and values) - for that reason, it should only be used for testing purposes! If you want to persist more than just these few megabytes of data, you may consider the author's [direct locaForage adapter](https://github.com/rozek/gundb-direct-localforage-adapter) instead.

> **Important: after two weeks of intensive work and no substantial outcome, I have decided to give up on GunDB - it is full of bugs and - even worse - race conditions and the implementation looks like being hacked in a style used 40 years ago (when source code had to be compact and variable names short in order to fit into the memory) **

## Usage ##

Copy the contents of file [directLocalStorageAdapter.js](./src/directLocalStorageAdapter.js) into a `<script>` element and add it to the `<head>` section of your HTML document right after the one for GunDB itself.

```
<script src="https://cdn.jsdelivr.net/npm/gun/gun.js"></script>
<script>
  ... insert source code here
</script>
```

Then, create your GunDB instance with the following options (among others, if need be):

```
  const Gun = GUN({ localStorage:false, directLocalStorage:'key-prefix' })
```

where `key-prefix` specifies the prefix to be prepended to each node id before storing that node in localStorage (you may set it to '' but you will always have to specify a prefix)

From now on, work with your instance as usual - you should not recognize any difference except that GunDB will run much faster now.

## License ##

[MIT License](LICENSE.md)
