
get_latest_release() {
  curl --silent "https://github.com/Tseacen/Lester-OpenSource/releases/latest" | # Get latest release from GitHub api
    grep '"tag_name":' |                                            # Get tag line
    sed -E 's/.*"([^"]+)".*/\1/'                                    # Pluck JSON value
}

get_latest_release()