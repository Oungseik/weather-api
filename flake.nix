{
  inputs = {
    utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, utils }: utils.lib.eachDefaultSystem (system:
    let
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShell = pkgs.mkShellNoCC {
        buildInputs = with pkgs; [
          bun

          # optional dependencies to make RESTapi request from Neovim
          luajitPackages.lua-curl
          luajitPackages.nvim-nio
          luajitPackages.mimetypes
          luajitPackages.xml2lua
          pkg-config
          openssl
          sqlite
        ];

        shellHook =
          ''
            tmux new-session -s weather-app -n editor
          '';

        LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [ pkgs.stdenv.cc.cc ];
      };
    }
  );
}
