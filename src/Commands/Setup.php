<?php

namespace Tualo\Office\ReportPivot\Commands;

use Garden\Cli\Cli;
use Garden\Cli\Args;
use phpseclib3\Math\BigInteger\Engines\PHP;
use Tualo\Office\Basic\ISetupCommandline;
use Tualo\Office\ExtJSCompiler\Helper;
use Tualo\Office\Basic\TualoApplication as App;
use Tualo\Office\Basic\PostCheck;
use Tualo\Office\Basic\CommandLineInstallSessionSQL;
use Tualo\Office\ERP\Commands\Setup as BaseSetup;

class Setup extends BaseSetup
{



    public static function getHeadLine(): string
    {
        return 'Report Pivot Setup Command';
    }
    public static function getCommands(Args $args): array
    {
        $parentCommands = parent::getCommands($args);
        return [
            ...$parentCommands,
            'install-sql-report-pivot'
        ];
    }

    public static function getCommandName(): string
    {
        return 'report-pivot';
    }
    public static function getCommandDescription(): string
    {
        return 'perform a complete report-pivot setup';
    }
    public static function setup(Cli $cli)
    {
        $cli->command(self::getCommandName())
            ->description(self::getCommandDescription())
            ->opt('client', 'only use this client', true, 'string');
    }
}
