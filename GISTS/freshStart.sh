# First thing when spinning up a newly installed debian
# bash <(curl -s https://URLURLURLURLRULRULRULURL)

echo set syntax=on >> .vimrc
echo set nowrap >> .vimrc


 
sudo apt-get update
sudo apt-get -y upgrade
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs git-core git-flow gcc make libncurses5-dev libncursesw5-dev build-essential sysstat

git config --global user.name "MW"

mkdir ~/git 
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Setup go 1.9
wget https://storage.googleapis.com/golang/go1.9.2.linux-amd64.tar.gz
sudo tar -xvf go1.9.2.linux-amd64.tar.gz
sudo mv go /usr/local
echo "export GOROOT=/usr/local/go" >> ~/.profile
echo "export GOPATH=$HOME/.go" >> ~/.profile
echo "export PATH=$GOPATH/bin:$GOROOT/bin:$PATH" >> ~/.profile

echo "export PATH=~/.npm-global/bin:$PATH" >> ~/.profile
source ~/.profile


npm install -g yarn rexreplace

