/**** direct localStorage adapter ****/

  let Storage = localStorage         // will deliberately throw if not available

  GUN.on('create', function (Context) {        // do not use a "fat arrow" here!
    this.to.next(Context)

    let StorageKeyPrefix = Context.opt.directLocalStorage
    if ( StorageKeyPrefix == null) { return }        // adapter wasn't requested

  /**** get - retrieve the contents of a given node ****/

    Context.on('get', function (WireMessage) {           // no "fat arrow" here!
      this.to.next(WireMessage)

      let DedupId = WireMessage['#']
      let LEX     = WireMessage.get
      let Soul    = (LEX == null ? undefined : LEX['#'])
      if (Soul == null) { return }

      const StorageKey = StorageKeyPrefix + Soul

      let Data = Storage.getItem(StorageKey)        // fetches data from storage
      if (Data == null) {                        // acknowledge a missing node
        Context.on('in', { '@':DedupId, err:null, put:null })
      } else {
        let Key = LEX['.']
        if ((Key != null) && ! Object.plain(Key)) {
          Data = GUN.state.ify(
            {}, Key, GUN.state.is(Data,Key), Data[Key], Soul
          )
        }

        Context.on('in', { '@':DedupId, ok:1, err:null, put:Data })
      }
    })

  /**** put - patches the contents of a given node ****/

    Context.on('put', function (WireMessage) {           // no "fat arrow" here!
      this.to.next(WireMessage)

      let LEX     = WireMessage.put
      let Soul    = LEX['#'], Key  = LEX['.']
      let DedupId = WireMessage['#']
      let Ok      = WireMessage.ok || ''

      const StorageKey = StorageKeyPrefix + Soul

      let Error = undefined
      try {
        let currentContents = Storage.getItem(StorageKey) || '{}'
        Storage.setItem(StorageKey, JSON.stringify(  // merges data into storage
          GUN.state.ify(
            JSON.parse(currentContents), Key, LEX['>'], LEX[':'], Soul
          )
        ))

        Context.on('in', { '@':DedupId, ok:true, err:null })
      } catch (Signal) {
        Error = 'localStorage failure: ' + Signal + (
          Signal.stack == null ? '' : '' + Signal.stack
        )
        Context.on('in', { '@':DedupId, ok:false, err:Error })
      }
    })
  })

