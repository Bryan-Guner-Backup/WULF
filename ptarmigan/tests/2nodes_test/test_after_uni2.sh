#!/bin/bash
set -eu

msat3=0
msat4=0

getblockcount() {
    echo `bitcoin-cli -datadir=$PWD -conf=$PWD/regtest.conf getblockcount`
}

amount() {
    echo `./ptarmcli -l $1 | jq -e '.result.total_local_msat'`
}

get_amount() {
    msat3=`amount 3334`
    msat4=`amount 4445`
    echo msat3=${msat3} msat4=${msat4}
}

check_amount() {
    msat3_after=`amount 3334`
    msat4_after=`amount 4445`
    echo msat3=${msat3_after} msat4=${msat4_after}
    if [ $# -eq 1 ] && [ "$1" = "same" ]; then
        if [ ${msat3} -ne ${msat3_after} ]; then
            echo invalid amount3: != ${msat3}
            exit 1
        fi
        if [ ${msat4} -ne ${msat4_after} ]; then
            echo invalid amount4: != ${msat4}
            exit 1
        fi
    else
        if [ ${msat3} -eq ${msat3_after} ]; then
            echo invalid amount3: == ${msat3}
            exit 1
        fi
        if [ ${msat4} -eq ${msat4_after} ]; then
            echo invalid amount4: == ${msat4}
            exit 1
        fi
    fi
    msat3=${msat3_after}
    msat4=${msat4_after}
}

# 1: amount require type(SAME, DIFF)
# 2: amount require value
# 3: list require type(SAME, DIFF)
# 4: list require items
check_paytowallet() {
    ./ptarmcli --getinfo ${TARGET_NODE}

    P2W=`./ptarmcli --paytowallet ${TARGET_NODE}`
    echo ${P2W} | jq .
    AMOUNT=`echo ${P2W} | jq -r -e '.result.wallet.amount'`
    LIST=`echo ${P2W} | jq -r -e '.result.list | length'`

    ret=0
    if [ "$1" = "SAME" ]; then
        if [ ${AMOUNT} -eq $2 ]; then
            echo OK: amount == $2
        else
            echo ERROR: amount != $2
            ret=1
        fi
    else
        if [ ${AMOUNT} -ne $2 ]; then
            echo OK: amount != $2
        else
            echo ERROR: amount == $2
            ret=1
        fi
    fi
    if [ "$3" = "SAME" ]; then
        if [ ${LIST} -eq $4 ]; then
            echo OK: list == $4
        else
            echo ERROR: list != $4
            ret=1
        fi
    else
        if [ ${LIST} -ne $4 ]; then
            echo OK: list != $4
        else
            echo ERROR: list == $4
            ret=1
        fi
    fi
    return ${ret}
}


echo node_3333 no-fulfill return
./ptarmcli --debug 1 3334

echo st4e start
./example_st4e.sh
sleep 5 # XXX: TODO
check_amount
echo st4e end

TARGET_NODE=3334

CLOSE_PUBKEY=`./showdb -d node_3333 -s | jq -r .channel_info[0].close.local_scriptPubKey`
echo CLOSE_PUBKEY=${CLOSE_PUBKEY}

echo quit 4444
./ptarmcli -q 4445
sleep 3

BASECOUNT=`getblockcount`
echo BASECOUNT=${BASECOUNT}

echo unilateral close from 3333
./ptarmcli -c conf/peer4444.conf -xforce ${TARGET_NODE}

echo 4444???offered HTLC???3333???received HTLC?????????????????????
echo unilateral close???3333????????????3333?????????????????????\(local unilateral close\)???4444???kill?????????
echo    to_self_delay: node_3333=30, node_4444=31
echo
echo ??????generate???commit_tx???mining???????????????preimage????????????????????????HTLC success TX????????????
echo spending to_local output tx??????to_self_delay???31?????????31conf???spendable????????????

# (alpha=438)
# blockcount: alpha
#       local commit_tx broadcast
# blockcount: alpha+1 ???A
#       commit_tx conf=1
#       received HTLC ==> HTLC success tx broadcast
# blockcount: alpha+2 ???B
#       commit_tx conf=2
#       HTLC_tx conf=1
#
# ...
#
# blockcount: alpha+30 ???C
#       commit_tx conf=30
#       HTLC_tx conf=29
# blockcount: alpha+31 ???D
#       commit_tx conf=31 ==> spendable
#       HTLC_tx conf=30
# blockcount: alpha+32 ???Es
#       HTLC_tx conf=31 ==> spendable


# ???A
#   local commit_tx=1conf
#   to_local:
#       to_self_delay??????
#   received HTLC:
#       preimage???????????????HTLC success tx?????????
#       bitcoind????????????SPENT????????????????????????????????????????????????
./generate.sh 1
sleep 30
echo ---------- commit_tx conf=1 ---------------
if [ "$1" = "BITCOIND" ]; then
    check_paytowallet SAME 0 SAME 2
    if [ $? -eq 0 ]; then
        echo OK if bitcoind version
    else
        exit 1
    fi
elif [ "$1" = "BITCOINJ" ]; then
    check_paytowallet SAME 0 SAME 1
    if [ $? -eq 0 ]; then
        echo OK if bitcoinj version
    else
        exit 1
    fi
else
    echo ERROR
    exit 1
fi
echo ---------- OK: commit_tx conf=1 ---------------

# ???B
#   local commit_tx=2conf
#   to_local:
#       to_self_delay??????
#   HTLC success tx:
#       to_self_delay??????
./generate.sh 1
sleep 30
echo ---------- commit_tx conf=2, HTLC_tx conf=1 ---------------
check_paytowallet SAME 0 SAME 2
if [ $? -ne 0 ]; then
    exit 1
fi
echo ---------- OK: commit_tx conf=1 ---------------

# ???C
#   local commit_tx=30conf
#   to_local:
#       to_self_delay??????
#   HTLC success tx:
#       to_self_delay??????
./generate.sh 28
sleep 30
echo ---------- commit_tx conf=30, HTLC_tx conf=29 ---------------
check_paytowallet SAME 0 SAME 2
if [ $? -ne 0 ]; then
    exit 1
fi
echo ---------- OK: commit_tx conf=30, HTLC_tx conf=29 ---------------

# ???D
#   local commit_tx=31conf
#   to_local:
#       to_self_delay???????????????paytowallet??????
#   HTLC success tx:
#       to_self_delay??????
./generate.sh 1
sleep 30
echo ---------- commit_tx conf=31, HTLC_tx conf=30 ---------------
check_paytowallet DIFF 0 SAME 2
if [ $? -ne 0 ]; then
    exit 1
fi
echo ---------- OK: commit_tx conf=31, HTLC_tx conf=30 ---------------

#   to_local:
#       paytowallet??????
#   HTLC success tx:
#       paytowallet?????????
echo ---------- spend: to_local output ---------------
P2W=`./ptarmcli --paytowallet=1 ${TARGET_NODE}`
echo ${P2W} | jq .
echo ---------- OK: spend: to_local output ---------------

#   HTLC success tx:
#       paytowallet?????????
echo ---------- after spend: to_local output ---------------
check_paytowallet SAME 0 SAME 1
if [ $? -ne 0 ]; then
    exit 1
fi
echo ---------- OK: after spend: to_local output ---------------

# ???E
#   local commit_tx=32conf
#   HTLC success tx:
#       to_self_delay???????????????paytowallet??????
./generate.sh 1
sleep 30
echo ---------- HTLC_tx conf=31 ---------------
check_paytowallet DIFF 0 SAME 1
if [ $? -ne 0 ]; then
    exit 1
fi
echo ---------- OK: HTLC_tx conf=31 ---------------

#   HTLC success tx:
#       paytowallet??????
echo ---------- spend: HTLC_tx ---------------
P2W=`./ptarmcli --paytowallet=1 ${TARGET_NODE}`
echo ${P2W} | jq .
echo ---------- OK: spend: HTLC_tx ---------------

#   ?????????
echo ---------- after spend: HTLC_tx ---------------
check_paytowallet SAME 0 SAME 0
if [ $? -ne 0 ]; then
    exit 1
fi
echo ---------- OK: after spend: HTLC_tx ---------------

blockcount=`getblockcount`
if [ $blockcount -ne $((BASECOUNT+32)) ]; then
    echo blockcount is not +32\($blockcount\)
    exit 1
fi

echo ?????????????????????????????????????????????????????????
echo bitcoind??????listtransactions???2???receive?????????????????????
./generate.sh 1

if [ "$1" = "BITCOIND" ]; then
    # 1BTC????????????????????????mining?????????????????????????????????????????????????????????
    CNT=`bitcoin-cli -datadir=. -conf=regtest.conf listunspent | jq -e '. | map(select(.amount < 1)) | length'`
    if [ ${CNT} -eq 2 ]; then
        echo unspent == 2\(to_local and HTLC\)
    else
        echo ERROR: unspent != 2
        exit 1
    fi
fi
