{
  "targets": [
    {
      "target_name": "BonjourListener",
      "sources": [ "BonjourListener.cc" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
        "vendor/Bonjour SDK/Include"
      ],
      "libraries": [
        "-l<(module_root_dir)/vendor/Bonjour SDK/Lib/x64/dnssd.lib",
         "-lws2_32.lib"
      ],
    }
  ]
}
