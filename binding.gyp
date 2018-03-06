{
  "targets": [
    {
      "target_name": "BonjourListener",
      "sources": [ "BonjourListener.cc" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ],
      "conditions":[
        ['OS=="win"',{
            "include_dirs": [
              "vendor/Bonjour SDK/Include"
            ],
            "libraries": [
              "-l<(module_root_dir)/vendor/Bonjour SDK/Lib/x64/dnssd.lib"
            ],
        }],
        ['OS=="linux"',{
            "libraries": [
              '<!@(pkg-config --libs avahi-compat-libdns_sd)'
            ],
            "cflags": [
              '<!@(pkg-config --cflags avahi-compat-libdns_sd)'
            ]
        }]
      ]
    }
  ]
}
