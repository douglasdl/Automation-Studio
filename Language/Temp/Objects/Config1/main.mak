SHELL := cmd.exe
CYGWIN=nontsec
export AS_BUILD_MODE := BuildAndCreateCompactFlash
export AS_VERSION := 4.7.5.60 SP
export AS_COMPANY_NAME := Toshiba
export AS_USER_NAME := dleal
export AS_PATH := C:/BrAutomation/AS47
export AS_BIN_PATH := C:/BrAutomation/AS47/Bin-en
export AS_PROJECT_PATH := C:/Users/dleal.MATSUI-JPO/Documents/git/GitTeian/Automation-Studio/Language
export AS_PROJECT_NAME := Language
export AS_SYSTEM_PATH := C:/BrAutomation/AS/System
export AS_VC_PATH := C:/BrAutomation/AS47/AS/VC
export AS_TEMP_PATH := C:/Users/dleal.MATSUI-JPO/Documents/git/GitTeian/Automation-Studio/Language/Temp
export AS_CONFIGURATION := Config1
export AS_BINARIES_PATH := C:/Users/dleal.MATSUI-JPO/Documents/git/GitTeian/Automation-Studio/Language/Binaries
export AS_GNU_INST_PATH := C:/BrAutomation/AS47/AS/GnuInst/V4.1.2
export AS_GNU_BIN_PATH := $(AS_GNU_INST_PATH)/bin
export AS_GNU_INST_PATH_SUB_MAKE := C:/BrAutomation/AS47/AS/GnuInst/V4.1.2
export AS_GNU_BIN_PATH_SUB_MAKE := $(AS_GNU_INST_PATH_SUB_MAKE)/bin
export AS_INSTALL_PATH := C:/BrAutomation/AS47
export WIN32_AS_PATH := "C:\BrAutomation\AS47"
export WIN32_AS_BIN_PATH := "C:\BrAutomation\AS47\Bin-en"
export WIN32_AS_PROJECT_PATH := "C:\Users\dleal.MATSUI-JPO\Documents\git\GitTeian\Automation-Studio\Language"
export WIN32_AS_SYSTEM_PATH := "C:\BrAutomation\AS\System"
export WIN32_AS_VC_PATH := "C:\BrAutomation\AS47\AS\VC"
export WIN32_AS_TEMP_PATH := "C:\Users\dleal.MATSUI-JPO\Documents\git\GitTeian\Automation-Studio\Language\Temp"
export WIN32_AS_BINARIES_PATH := "C:\Users\dleal.MATSUI-JPO\Documents\git\GitTeian\Automation-Studio\Language\Binaries"
export WIN32_AS_GNU_INST_PATH := "C:\BrAutomation\AS47\AS\GnuInst\V4.1.2"
export WIN32_AS_GNU_BIN_PATH := "$(WIN32_AS_GNU_INST_PATH)\\bin" 
export WIN32_AS_INSTALL_PATH := "C:\BrAutomation\AS47"

.suffixes:

ProjectMakeFile:

	@'$(AS_BIN_PATH)/BR.AS.AnalyseProject.exe' '$(AS_PROJECT_PATH)/Language.apj' -t '$(AS_TEMP_PATH)' -c '$(AS_CONFIGURATION)' -o '$(AS_BINARIES_PATH)'   -sfas -buildMode 'BuildAndCreateCompactFlash'   

