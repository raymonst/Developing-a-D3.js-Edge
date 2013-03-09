# Working title: Developing a D3.js Edge

**To Be Done** 

This is the repository containing all sources, data sets and miscelleaneous documentation bits and pieces for the book.

Directory organization should be pretty self-explanatory.


## The Repository - Organization

See the README in each subdirectory for more info; the fundamental structure here is separating data sets and source code that should accompany the book.

The source code collective is split into three parts based on origin and purpose: 

- all source code developed specifically for the book is stored in the `/src` directory

- all tooling, either for generic use or specific to the book, ended up in `/util`

- all libraries, such as D3 itself, end up as 'git submodules' in `/lib`.


## Note about reshuffling the directory tree

When the structure needs to change, this can be handled very elegantly by git when you make sure to 'git add' the moved directories (files, rather) in the very same commit that marks their old place as 'removed': git will detect the 'move' and any branch/merge activity will go smoothly then.


## How to peruse / install locally

    git clone 
    git submodule update --init --recursive
    make


(Mike's using Makefiles, so do we? -- I use them based on GNU autotooling in our own company. Can do the same for this.)

